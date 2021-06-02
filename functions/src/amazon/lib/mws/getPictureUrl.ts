import amazonMws from '../mwsApi';
import * as userCreds from '../userData/getUserCreds';
import { UserCredentials } from '../../../types';

const getMatchingProduct = async (ASIN: string, sellerId?: string) => {
  let productData;
  await new Promise((r) => setTimeout(r, 100));
  productData = await amazonMws.products.search({
    Version: "2011-10-01",
    Action: "GetMatchingProductForId",
    SellerId: config.sellerId,
    MarketplaceId: "ATVPDKIKX0DER",
    IdType: "ASIN",
    "IdList.Id.1": ASIN,
  });

  const imageData = {
    imageUrl:
      productData.Products.Product.AttributeSets.ItemAttributes.SmallImage.URL,
    imageHeight:
      productData.Products.Product.AttributeSets.ItemAttributes.SmallImage
        .Height.Value,
    imageWidth:
      productData.Products.Product.AttributeSets.ItemAttributes.SmallImage.Width
        .Value,
  };

  let productInfo;
  if (
    productData.Products.Product.AttributeSets.ItemAttributes.Title !==
    undefined
  ) {
    productInfo = {
      productTitle:
        productData.Products.Product.AttributeSets.ItemAttributes.Title,
    };
  }