const config = {
    development: {
      apiUrl: 'http://localhost:3001',
    },
    production: {
      apiUrl: 'https://your-production-api.com',
    },
  };
  
  export default config[process.env.NODE_ENV || 'development'];
  