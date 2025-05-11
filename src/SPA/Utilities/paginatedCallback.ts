import { stringify } from '@groton/canvas-cli.utilities';

export type Options<ObjectType, ParamType> = {
  params?: Partial<ParamType>;
  callback?: (obj: ObjectType) => unknown;
};

export function paginatedCallback<APIResponse, ObjectType, ParamType = never>(
  endpoint: string,
  instantiator: (item: APIResponse) => ObjectType
) {
  return async ({
    callback,
    params = {}
  }: Options<ObjectType, ParamType> = {}) => {
    params = { per_page: 50, ...params };
    let nextEndpoint: string | undefined = `${endpoint}?${stringify(params)}`;
    const result: ObjectType[] = [];
    do {
      const response = await fetch(nextEndpoint);
      if (response.ok) {
        const page = (await response.json()) as APIResponse[];
        result.push(
          ...page.map((item) => {
            const plannerItem = instantiator(item);
            if (callback) {
              callback(plannerItem);
            }
            return plannerItem;
          })
        );

        const matches = /<([^>]+)>;\s*rel="next"/gm.exec(
          response!.headers.get('link') || ''
        );
        nextEndpoint =
          matches && matches.length >= 2
            ? `/canvas${matches[1].replace(new RegExp(`^${consumer_instance_url}`), '')}`
            : undefined;
      } else {
        throw new Error();
      }
    } while (Array.isArray(result) && nextEndpoint);
    return result;
  };
}
