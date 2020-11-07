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


export const insertToProductTable = `
    insert into products (title, description, price) 
    values ($1, $2, $3)
    returning id
`;

export const insertToStocksTable = `
    insert into stocks (product_id, count) 
    values ($1, $2)
`;