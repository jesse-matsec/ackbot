import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * See: https://vercel.com/docs/concepts/functions/serverless-functions/supported-languages#using-typescript
 */
export default (request: VercelRequest, response: VercelResponse) => {
	const { name } = request.query;
	response.status(200).send(`Hello ${name}!`);
};