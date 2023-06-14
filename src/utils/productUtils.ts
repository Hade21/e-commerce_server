import { ObjectCartProduct } from "global";

export function getCartTotal(item: ObjectCartProduct[]) {
  let cartTotal: number = 0;
  for (let i = 0; i < item.length; i++) {
    cartTotal += Number(item[i].price) * Number(item[i].count);
  }
  return cartTotal;
}
