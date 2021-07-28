// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { compile, CompileResult } from '../../lib/compiler'
import { runParser } from '../../lib/language/runParser'

// type Data = {
//   name: string
// }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).json(runParser(req.body))
}
