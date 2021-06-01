const apiURL = (): string => {
  let mode = 'prod';
  const productionURL =
    'https://us-central1-inventory-app-v2-262de.cloudfunctions.net/app';
  const developmentURL =
    'http://localhost:5001/inventory-app-v2-262de/us-central1/app';
  if (mode === 'prod') {
    return productionURL;
  } else if (mode === 'dev') {
    return developmentURL;
  } else {
    return 'None';
  }
};

export default apiURL;
