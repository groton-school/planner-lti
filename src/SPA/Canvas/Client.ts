import { JSONPrimitiveTypes, JSONValue } from '@battis/typescript-tricks';

type PathParameter = Record<string, JSONPrimitiveTypes>;
type QueryParameter = Record<string, JSONValue>;
type FormParameter = Record<string, JSONValue>;

type RequestOptions<
  P extends PathParameter,
  Q extends QueryParameter,
  F extends FormParameter
> = {
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
  endpoint: string;
  headers?: Record<string, string>;
  params?: {
    path?: P;
    query?: Q;
    form?: F;
  };
};

export async function request<
  ExpectedJSONResponse extends JSONValue,
  P extends PathParameter | never = PathParameter,
  Q extends QueryParameter | never = QueryParameter,
  F extends FormParameter | never = FormParameter
>({
  method = 'GET',
  endpoint,
  headers,
  params
}: RequestOptions<P, Q, F>): Promise<ExpectedJSONResponse | undefined> {
  endpoint =
    toPath({ endpoint, params: params?.path }) +
    toQuery(toSearchParams({ data: params?.query }));
  const options: RequestInit = { method, headers };
  if (params?.form) {
    options.body = toSearchParams({ data: params.form });
  }
  console.log({ options });
  return (await (
    await fetch(endpoint, options)
  ).json()) as ExpectedJSONResponse;
}

export const Get = request;
export async function Put<
  Result extends JSONValue,
  P extends PathParameter,
  Q extends QueryParameter,
  F extends FormParameter
>(options: Omit<RequestOptions<P, Q, F>, 'method'>) {
  return await request<Result, P, Q, F>({ method: 'PUT', ...options });
}
export async function Post<
  Result extends JSONValue,
  P extends PathParameter,
  Q extends QueryParameter,
  F extends FormParameter
>(options: Omit<RequestOptions<P, Q, F>, 'method'>) {
  return await request<Result, P, Q, F>({ method: 'POST', ...options });
}
export async function Delete<
  Result extends JSONValue,
  P extends PathParameter,
  Q extends QueryParameter,
  F extends FormParameter
>(options: Omit<RequestOptions<P, Q, F>, 'method'>) {
  return await request<Result, P, Q, F>({ method: 'DELETE', ...options });
}

type ToPathOptions = {
  endpoint: string;
  params?: PathParameter;
};

function toPath({ endpoint, params = {} }: ToPathOptions): string {
  let path = endpoint;
  for (const param in params) {
    path = path.replaceAll(`:${param}`, `${params[param]}`);
  }
  return path;
}

function toQuery(data: URLSearchParams): string {
  const params: string[] = [];
  for (const [key, value] of data.entries()) {
    params.push(`${key}=${encodeURIComponent(value)}`);
  }
  if (params.length) {
    return `?${params.join('&')}`;
  }
  return '';
}

type ToFormDataOptions = {
  data: unknown;
  key?: string;
  formData?: URLSearchParams;
  includeNumericIndices?: boolean;
};

function toSearchParams({
  data,
  key,
  formData = new URLSearchParams(),
  includeNumericIndices = false
}: ToFormDataOptions) {
  if (data && typeof data === 'object') {
    for (const prop in data) {
      toSearchParams({
        data: data[prop as keyof typeof data],
        key: key
          ? `${key}[${includeNumericIndices || isNaN(parseInt(prop)) ? prop : ''}]`
          : prop,
        formData,
        includeNumericIndices
      });
    }
  } else if (key) {
    formData.append(key, typeof data === 'string' ? data : `${data}`);
  }
  return formData;
}

export function asParams<FormParams extends Record<string, JSONValue>>({
  form,
  container
}: {
  form: HTMLFormElement;
  container?: string;
}): FormParams {
  const params: Record<string, JSONValue> = {};
  // eslint-disable-next-line prefer-const
  for (let [key, value] of new FormData(form)) {
    if (container) {
      key = `${container}[${key}]`;
    }
    if (!(value instanceof File)) {
      params[key] = value;
    }
  }
  return params as FormParams;
}
