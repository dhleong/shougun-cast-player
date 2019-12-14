import { IError } from "./store";

export const debugData = [
    {
        cover: "https://img1.hulu.com/user/v3/artwork/f11df77f-115e-4eba-8efa-264f0ff322d0?base_image_bucket_name=image_manager&base_image=1e20918d-629f-4720-a44e-29b01c22d133&operations=%5B%7B%22resize%22%3A%22800x800%7Cmax%22%7D%2C%7B%22format%22%3A%22jpeg%22%7D%5D",
        id: "babbling:HuluApp:the-good-place",
        title: "The Good Place",
    },

    {
        id: "local:critical-role",
        title: "Critical Role",
    },

    {
        cover: "https://img4.hulu.com/user/v3/artwork/1138ee62-b9d9-4561-8094-3f7cda4bbd22?base_image_bucket_name=image_manager&base_image=85c6b7e5-0b6a-4730-9b60-66b20ea63fb4&operations=%5B%7B%22resize%22%3A%22600x600%7Cmax%22%7D%2C%7B%22format%22%3A%22jpeg%22%7D%5D",
        id: "babbling:HuluApp:the-rookie",
        title: "The Rookie",
    },
];

export const debugError: IError = {
    message: "Something went wrong",

    detail: "It messed up. I don't know why",
    stack: [
        "1. https://img4.hulu.com/user/v3/artwork/1138ee62-b9d9-4561-8094-3f7cda4bbd22?base_image_bucket_name=image_manager&base_image=85c6b7e5-0b6a-4730-9b60-66b20ea63fb4&operations=%5B%7B%22resize%22%3A%22600x600%7Cmax%22%7D%2C%7B%22format%22%3A%22jpeg%22%7D%5D",
        "2. bar",
    ],
};
