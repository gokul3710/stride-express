import { Request, Response } from 'express';
import { toFilterQuery } from '../../middlewares/filters';
import productQueryHelpers from '../../helpers/shop/product-query-helpers';


export default {

    postFilterProducts: (req: Request, res: Response) => {
        if(req.body){
            const [filters, sort] =  toFilterQuery(req.body)
            
            productQueryHelpers.filterProductsAgg(filters,sort,Number(req.params.page)).then((response)=>{
                res.status(200).json(response)
            })
        }
    }
}