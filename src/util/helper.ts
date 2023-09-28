import { Request } from 'express';

export const wentWrong = 'Something went wrong! Please try again';

export type IDBQuery = {
  [key: string]: string | number | string[][] | { [key: string]: any };
};

export function queryGenerator(req: Request) {
  const limit = req.query?.limit ? Number(req.query?.limit) : 500;
  const offset = req.query?.page
    ? (Number(req.query?.page) - 1) * Number(limit)
    : 0;

  const sort = { createdAt: req.query?.sort === 'asc' ? 1 : -1 };

  return {
    sort,
    limit,
    offset,
  };
}

export function replaceVariables(
  url: string,
  variables: { [key: string]: any },
): string {
  // Iterate through the properties of the variables object
  for (const key in variables) {
    if (variables.hasOwnProperty(key)) {
      // Create a regular expression to match the placeholder {key} in the URL
      const regex = new RegExp(`{${key}}`, 'g');
      // Replace the placeholder with the corresponding value from the object
      url = url.replace(regex, variables[key]);
    }
  }
  // Return the URL with placeholders replaced by values
  return url;
}
