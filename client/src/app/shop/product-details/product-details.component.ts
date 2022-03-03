import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct = {} as IProduct;
  existingProduct: IBasketItem | undefined;
  quantity: number = 1;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private basketService: BasketService) {
      this.breadcrumbService.set('@productDetails', ' ');
    }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket() {
    if (!this.existingProduct) {
      this.basketService.addItemToBasket(this.product, this.quantity);
    } else {
      this.basketService.addItemToBasket(this.product, this.quantity - this.existingProduct.quantity);
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || 0 as number;
    this.shopService.getProduct(+id).subscribe(product => {
      this.product = product;
      this.breadcrumbService.set('@productDetails', product.name);
      const basket = this.basketService.getCurrentBasketValue();
      var productMaybe = this.getExistingItemFromBasket();
      if (productMaybe) {
        this.quantity = productMaybe.quantity;
        this.existingProduct = productMaybe;
      }
    }, error => {
      console.log(error);
    });
  }

  private getExistingItemFromBasket(): IBasketItem | undefined {
    const basket = this.basketService.getCurrentBasketValue();

    if (basket) {
      if (basket.items.some(x => x.id === this.product.id)) {
        const existingProduct = basket.items.find(x => x.id === this.product.id);
        return existingProduct;
      }
    }

    return undefined;
  }

}
