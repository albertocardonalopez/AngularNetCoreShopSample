import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource: BehaviorSubject<IBasket | null> = new BehaviorSubject<IBasket | null>(null);
  private basketTotalSource: BehaviorSubject<IBasketTotals | null> = new BehaviorSubject<IBasketTotals | null>(null);
  basket$ = this.basketSource?.asObservable();
  basketTotal$ = this.basketTotalSource?.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource?.next(basket);
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource?.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  getCurrentBasketValue() {
    return this.basketSource?.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket);
    }
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      if (basket.items[foundItemIndex].quantity > 1) {
        basket.items[foundItemIndex].quantity--;
      } else {
        this.removeItemFromBasket(item);
      }
      this.setBasket(basket);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.items.some(x => x.id === item.id)) {
        basket.items = basket.items.filter(x => x.id != item.id);
        if (basket.items.length > 0) {
          this.setBasket(basket);
        } else {
          this.deleteBasket(basket);
        }
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotalMaybe = basket?.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotalMaybe ? subtotalMaybe + shipping : 0;
    const subtotal = subtotalMaybe ? subtotalMaybe : 0;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id == itemToAdd.id);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id, 
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity: quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
