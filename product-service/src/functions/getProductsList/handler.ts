import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { PRODUCT_LIST } from "src/mock";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  return formatJSONResponse({
    data: PRODUCT_LIST
  })
}

export const main = middyfy(getProductsList)