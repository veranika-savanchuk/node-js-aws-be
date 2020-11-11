import * as yup from 'yup';

const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().required().positive().integer(),
    count: yup.number().required().positive().integer(),
});


export const validateProduct = async (product) => schema.isValid(product);