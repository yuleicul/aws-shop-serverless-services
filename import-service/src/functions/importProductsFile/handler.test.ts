import { innerHandler } from './handler'

it('test', async () => {
  console.log(await innerHandler('test.csv'))
})