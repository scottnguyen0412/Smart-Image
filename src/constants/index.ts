export const navLinks = [
    {
      label: "Trang Chủ",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Khôi Phục Hình Ảnh",
      route: "/transformations/create/restore",
      icon: "/assets/icons/image.svg",
    },
    {
      label: "Tạo Mẫu Sinh Động",
      route: "/transformations/create/fill",
      icon: "/assets/icons/stars.svg",
    },
    {
      label: "Loại Bỏ Vật Thể",
      route: "/transformations/create/remove",
      icon: "/assets/icons/scan.svg",
    },
    {
      label: "Đổi Màu Đối Tượng",
      route: "/transformations/create/recolor",
      icon: "/assets/icons/filter.svg",
    },
    {
      label: "Xoá Phông Nền",
      route: "/transformations/create/removeBackground",
      icon: "/assets/icons/camera.svg",
    },
    {
      label: "Hồ Sơ",
      route: "/profile",
      icon: "/assets/icons/profile.svg",
    },
    {
      label: "Mua Tín Dụng",
      route: "/credits",
      icon: "/assets/icons/bag.svg",
    },
  ];
  
  export const plans = [
    {
      _id: 1,
      name: "Miễn Phí",
      icon: "/assets/icons/free-plan.svg",
      price: 0,
      credits: 20,
      inclusions: [
        {
          label: "20 Tín Dụng Miễn Phí",
          isIncluded: true,
        },
        {
          label: "Quyền truy cập cơ bản vào dịch vụ",
          isIncluded: true,
        },
        {
          label: "Hỗ trợ khách hàng ưu tiên",
          isIncluded: false,
        },
        {
          label: "Cập nhật ưu tiên",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Gói chuyên nghiệp",
      icon: "/assets/icons/free-plan.svg",
      price: 40,
      credits: 120,
      inclusions: [
        {
          label: "120 Tín Dụng",
          isIncluded: true,
        },
        {
          label: "Toàn quyền truy cập vào các dịch vụ",
          isIncluded: true,
        },
        {
          label: "Hỗ trợ khách hàng ưu tiên",
          isIncluded: true,
        },
        {
          label: "Cập nhật ưu tiên",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Gói cao cấp",
      icon: "/assets/icons/free-plan.svg",
      price: 199,
      credits: 2000,
      inclusions: [
        {
          label: "2000 Tín Dụng",
          isIncluded: true,
        },
        {
          label: "Toàn quyền truy cập vào các dịch vụ",
          isIncluded: true,
        },
        {
          label: "Hỗ trợ khách hàng ưu tiên",
          isIncluded: true,
        },
        {
          label: "Cập nhật ưu tiên",
          isIncluded: true,
        },
      ],
    },
  ];
  
  export const transformationTypes = {
    restore: {
      type: "restore",
      title: "Khôi Phục Hình Ảnh",
      subTitle: "Tinh chỉnh ảnh bằng cách loại bỏ nhiễu và các vết không hoàn hảo",
      config: { restore: true },
      icon: "image.svg",
    },
    removeBackground: {
      type: "removeBackground",
      title: "Xoá Phông Nền",
      subTitle: "Xoá phông nền của hình ảnh sử dụng AI",
      config: { removeBackground: true },
      icon: "camera.svg",
    },
    fill: {
      type: "fill",
      title: "Tạo Mẫu Sinh Động",
      subTitle: "Tăng kích thước của một hình ảnh sử dụng AI Outpainting",
      config: { fillBackground: true },
      icon: "stars.svg",
    },
    remove: {
      type: "remove",
      title: "Loại Bỏ Vật Thể",
      subTitle: "Xác định và loại bỏ các vật thể khỏi hình ảnh",
      config: {
        remove: { prompt: "", removeShadow: true, multiple: true },
      },
      icon: "scan.svg",
    },
    recolor: {
      type: "recolor",
      title: "Đổi Màu Đối Tượng",
      subTitle: "Xác định và đổi màu các đối tượng từ hình ảnh",
      config: {
        recolor: { prompt: "", to: "", multiple: true },
      },
      icon: "filter.svg",
    },
  };
  
  export const aspectRatioOptions = {
    "1:1": {
      aspectRatio: "1:1",
      label: "Kích Thước Vuông (1:1)",
      width: 1000,
      height: 1000,
    },
    "3:4": {
      aspectRatio: "3:4",
      label: "Kích Thước Tiêu Chuẩn (3:4)",
      width: 1000,
      height: 1334,
    },
    "9:16": {
      aspectRatio: "9:16",
      label: "Kích Thước Điện Thoại (9:16)",
      width: 1000,
      height: 1778,
    },
  };
  
  export const defaultValues = {
    title: "",
    aspectRatio: "",
    color: "",
    prompt: "",
    publicId: "",
  };
  
  export const creditFee = -1;