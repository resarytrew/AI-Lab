import {loadPyodide} from 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.mjs';

const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
let activeOutput = null;

const pyodideReady = loadPyodide({
  indexURL: PYODIDE_INDEX_URL,
  stdin: () => '',
  stdout: (line) => activeOutput?.stdout.push(String(line)),
  stderr: (line) => activeOutput?.stderr.push(String(line)),
});

const TEST_HARNESS = String.raw`
import copy as _copy
import inspect as _inspect
import io as _io
import json as _json
import math as _math
import types as _types
from contextlib import redirect_stdout as _redirect_stdout, redirect_stderr as _redirect_stderr
from itertools import product as _product


def _same(left, right):
    if isinstance(left, float) or isinstance(right, float):
        try:
            return _math.isclose(float(left), float(right), rel_tol=1e-7, abs_tol=1e-9)
        except Exception:
            pass
    try:
        return left == right
    except Exception:
        return repr(left) == repr(right)


def _is_simple(value):
    if isinstance(value, (str, int, float, bool, type(None))):
        return True
    if isinstance(value, (list, tuple, dict, set)):
        return True
    return False


def _run(source, filename):
    namespace = {'__name__': '__main__'}
    compiled = compile(source, filename, 'exec')
    exec(compiled, namespace, namespace)
    return namespace


def _candidate_values(name, reference_namespace):
    if name in reference_namespace and _is_simple(reference_namespace[name]):
        return [_copy.deepcopy(reference_namespace[name])]

    lowered = name.lower()
    if any(token in lowered for token in ('text', 'word', 'token', 'char', 'string', 's')):
        return ['abc', 'abba', 'hello world']
    if any(token in lowered for token in ('record', 'criteria', 'mapping', 'dict', 'vocab', 'stoi')):
        return [
            {'a': True, 'b': False},
            {'value': 39.1, 'unit': 'C', 'source': 'person_A'},
        ]
    if any(token in lowered for token in ('values', 'items', 'data', 'errors', 'probs', 'counts', 'xs')):
        return [[1, 2, 3], [0.2, 0.3, 0.5], [True, False, True]]
    return [0, 1, 2, -1, 0.5]


def _function_tests(name, student_function, reference_function, reference_namespace):
    results = []
    try:
        signature = _inspect.signature(reference_function)
    except Exception:
        return results

    parameters = [
        parameter
        for parameter in signature.parameters.values()
        if parameter.kind in (
            _inspect.Parameter.POSITIONAL_ONLY,
            _inspect.Parameter.POSITIONAL_OR_KEYWORD,
        )
        and parameter.default is _inspect.Parameter.empty
    ]

    if len(parameters) > 3:
        return results

    candidate_groups = [_candidate_values(parameter.name, reference_namespace) for parameter in parameters]
    combinations = [()] if not candidate_groups else _product(*candidate_groups)
    successful_reference_cases = 0

    for arguments in combinations:
        if successful_reference_cases >= 2:
            break
        try:
            reference_args = _copy.deepcopy(tuple(arguments))
            expected = reference_function(*reference_args)
        except Exception:
            continue

        successful_reference_cases += 1
        try:
            student_args = _copy.deepcopy(tuple(arguments))
            actual = student_function(*student_args)
            passed = _same(actual, expected)
            detail = f'expected {expected!r}, got {actual!r}'
        except Exception as error:
            passed = False
            detail = f'{type(error).__name__}: {error}'

        results.append({
            'name': f'{name} example {successful_reference_cases}',
            'passed': bool(passed),
            'detail': detail,
        })

    return results


_student_namespace = _run(__ai_lab_student_source, '<student>')
with _redirect_stdout(_io.StringIO()), _redirect_stderr(_io.StringIO()):
    _reference_namespace = _run(__ai_lab_reference_source, '<reference>')

_tests = [{
    'name': 'Python source executes',
    'passed': True,
    'detail': 'The file compiled and executed without an exception.',
}]

_public_names = sorted(
    name for name in _reference_namespace
    if not name.startswith('_') and name != '__builtins__'
)

for _name in _public_names:
    _reference_value = _reference_namespace[_name]
    if isinstance(_reference_value, _types.ModuleType):
        continue

    if callable(_reference_value):
        _student_value = _student_namespace.get(_name)
        _exists = callable(_student_value)
        _tests.append({
            'name': f'{_name} exists',
            'passed': bool(_exists),
            'detail': 'Function found.' if _exists else 'Expected a callable with this name.',
        })
        if _exists:
            _tests.extend(_function_tests(_name, _student_value, _reference_value, _reference_namespace))
        continue

    if _is_simple(_reference_value):
        _exists = _name in _student_namespace
        _actual = _student_namespace.get(_name)
        _passed = _exists and _same(_actual, _reference_value)
        _tests.append({
            'name': f'{_name} value',
            'passed': bool(_passed),
            'detail': f'expected {_reference_value!r}, got {_actual!r}',
        })

_json.dumps({
    'passed': all(test['passed'] for test in _tests),
    'tests': _tests,
}, ensure_ascii=False)
`;

function stringifyResult(value) {
  if (value === undefined) return '';
  if (value === null) return 'None';
  try {
    return String(value);
  } finally {
    if (value && typeof value === 'object' && typeof value.destroy === 'function') {
      value.destroy();
    }
  }
}

async function handleMessage(message) {
  const startedAt = performance.now();
  activeOutput = {stdout: [], stderr: []};

  try {
    const pyodide = await pyodideReady;

    if (message.type === 'init') {
      return {
        id: message.id,
        type: 'ready',
        ok: true,
        pythonVersion: pyodide.runPython('import sys; sys.version.split()[0]'),
        durationMs: Math.round(performance.now() - startedAt),
      };
    }

    if (message.type === 'run') {
      const result = await pyodide.runPythonAsync(message.code);
      return {
        id: message.id,
        type: 'result',
        ok: true,
        stdout: activeOutput.stdout.join('\n'),
        stderr: activeOutput.stderr.join('\n'),
        result: stringifyResult(result),
        tests: [],
        durationMs: Math.round(performance.now() - startedAt),
      };
    }

    if (message.type === 'test') {
      pyodide.globals.set('__ai_lab_student_source', message.code);
      pyodide.globals.set('__ai_lab_reference_source', message.referenceCode);
      const serialized = await pyodide.runPythonAsync(TEST_HARNESS);
      const report = JSON.parse(String(serialized));
      return {
        id: message.id,
        type: 'result',
        ok: true,
        stdout: activeOutput.stdout.join('\n'),
        stderr: activeOutput.stderr.join('\n'),
        result: '',
        tests: report.tests,
        testsPassed: report.passed,
        durationMs: Math.round(performance.now() - startedAt),
      };
    }

    throw new Error(`Unknown worker message: ${message.type}`);
  } catch (error) {
    return {
      id: message.id,
      type: 'result',
      ok: false,
      stdout: activeOutput?.stdout.join('\n') ?? '',
      stderr: activeOutput?.stderr.join('\n') ?? '',
      result: '',
      tests: [],
      traceback: error instanceof Error ? error.message : String(error),
      durationMs: Math.round(performance.now() - startedAt),
    };
  } finally {
    activeOutput = null;
  }
}

self.onmessage = async (event) => {
  const response = await handleMessage(event.data);
  self.postMessage(response);
};
