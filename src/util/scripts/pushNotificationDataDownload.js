async function dummyExportFunc() {
  return { SUBSCRIPTION_URL: `${process.env.API_URL}/api/v1/subscription` };
}

module.exports = dummyExportFunc;
