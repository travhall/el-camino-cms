// config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
        secure: true,
      },
      actionOptions: {
        upload: {
          folder: env("CLOUDINARY_FOLDER", "el-camino"),
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          resource_type: "auto",
          transformation: {
            quality: "auto:best",
            fetch_format: "auto",
          },
        },
        delete: {},
      },
    },
  },
});
