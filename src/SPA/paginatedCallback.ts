export function paginatedCallback<APIResponse, ObjectType>(
  endpoint: string,
  instantiator: (item: APIResponse) => ObjectType
) {
  return async (callback?: (item: ObjectType) => unknown) => {
    let nextEndpoint: string | undefined = endpoint;
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
