import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { PRODUCT_LIST } from "src/mock";


const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const { productId } = event.pathParameters
  const product = PRODUCT_LIST.find(item => productId === item.id)
  return formatJSONResponse(product)
}

export const main = middyfy(getProductsById)