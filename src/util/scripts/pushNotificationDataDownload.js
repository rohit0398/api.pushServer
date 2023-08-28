async function dummyExportFunc() {
  return {
    SUBSCRIPTION_URL: `${process.env.API_URL}/api/v1/subscription`,
    VAPID_PUBLIC_KEY: 'BL4CN0bTsLEAUoC4WV1xcNAYj33T1F58PgeJgEUO0n_TQn1qpKG1oa7bfmhizBG1ei3tD_jka35c6HhBmw4Mkms',
  };
}

module.exports = dummyExportFunc;
