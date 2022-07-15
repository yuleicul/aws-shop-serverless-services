import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { NotFoundException } from "src/classes/NotFoundException";
import { PRODUCT_LIST } from "src/mock";

export const findProductById = (productId: string) => {
  return PRODUCT_LIST.find(item => productId === item.id)
}

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const productId = event.pathParameters?.productId!

  const product = findProductById(productId)

  if (product) return formatJSONResponse(product)
  else return new NotFoundException('Product not found')
}

export const main = middyfy(getProductsById)
