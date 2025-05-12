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
  Result extends JSONValue,
  P extends PathParameter | never = PathParameter,
  Q extends QueryParameter | never = QueryParameter,
  F extends FormParameter | never = FormParameter
>({
  method = 'GET',
  endpoint,
  headers,
  params
}: RequestOptions<P, Q, F>): Promise<Result | undefined> {
  endpoint =
    toPath({ endpoint, params: params?.path }) +
    toQuery(toFormData({ data: params?.query }));
  const options: RequestInit = { method, headers };
  if (params?.form) {
    options.body = toFormData({ data: params.form });
  }
  return (await (await fetch(endpoint, options)).json()) as Result;
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

function toQuery(data: FormData): string {
  const params: string[] = [];
  for (const [key, value] of data.entries()) {
    if (!(value instanceof File)) {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  if (params.length) {
    return `?${params.join('&')}`;
  }
  return '';
}

type ToFormDataOptions = {
  data: unknown;
  key?: string;
  formData?: FormData;
  includeNumericIndices?: boolean;
};

function toFormData({
  data,
  key,
  formData = new FormData(),
  includeNumericIndices = false
}: ToFormDataOptions) {
  if (data && typeof data === 'object') {
    for (const prop in data) {
      toFormData({
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
