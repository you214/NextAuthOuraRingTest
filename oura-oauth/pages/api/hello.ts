// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: any;
};

const OURA_API_KEY = process.env.OURA_API_KEY;
const OURA_API_BASE = 'https://api.ouraring.com';
/*
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { data } = await axios.get(OURA_API_BASE + '/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${OURA_API_KEY}`,
    },
  });
  res.status(200).json({ data });
}
*/
