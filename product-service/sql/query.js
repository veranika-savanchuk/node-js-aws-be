export const selectAllProducts =`
    select id,
           title,
           description,
           price,
           count
    from products p
    left join stocks s on p.id = s.product_id;
`;


export const selectProductById = `
    select id,
           title,
           description,
           price,
           count
    from products p
    left join stocks s on p.id = s.product_id
    where id = $1;
`;