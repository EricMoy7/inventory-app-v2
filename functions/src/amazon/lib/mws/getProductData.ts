import { UserCredentials } from '../../../types';
import amazonMws from '../mwsApi';

const getProductData = async (ASIN: string, amazonCred: UserCredentials) => {
  let productData;
  await new Promise((r) => setTimeout(r, 100));
  try {
    productData = await amazonMws.products.search({
      Version: '2011-10-01',
      Action: 'GetMatchingProductForId',
      SellerId: amazonCred.sellerId,
      MarketplaceId: 'ATVPDKIKX0DER',
      MWSAuthToken: amazonCred.mwsAuthToken,
      IdType: 'ASIN',
      'IdList.Id.1': ASIN,
    });

    const imageData = {
      imageUrl:
        productData.Products.Product.AttributeSets.ItemAttributes.SmallImage
          .URL,
      imageHeight:
        productData.Products.Product.AttributeSets.ItemAttributes.SmallImage
          .Height.Value,
      imageWidth:
        productData.Products.Product.AttributeSets.ItemAttributes.SmallImage
          .Width.Value,
    };
    return imageData;
  } catch (err) {
    console.log('Product not found');
    return { error: 'Details not found' };
  }
};

export default getProductData;
