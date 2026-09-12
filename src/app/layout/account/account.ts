import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user-service';
import { IAddress, IAddressPayload, IUser } from '../../core/models/user.model';
import { IGender } from '../../core/models/auth.model';

@Component({
  imports: [FormsModule],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './Account.html',
})
export class Account implements OnInit, OnDestroy {
  constructor(
    private _userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}

  myUser?: IUser;
  editingProfile = false;
  editingAddress: string | null = null; // address._id, or 'new'
  profileError = '';
  addressError = '';

  firstName = '';
  lastName = '';
  gender: IGender | '' = '';

  addressForm: IAddressPayload = this.emptyAddress();
  private subscriptions = new Subscription();

  ngOnInit(): void {
    const sub = this._userService.getProfile().subscribe({
      next: (res) => {
        this.myUser = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  startEditProfile(): void {
    if (!this.myUser) return;
    this.firstName = this.myUser.firstName;
    this.lastName = this.myUser.lastName;
    this.gender = this.myUser.gender;
    this.profileError = '';
    this.editingProfile = true;
  }
  cancelEditProfile(): void {
    this.editingProfile = false;
  }
  saveProfile(form: NgForm): void {
    if (form.invalid) return;
    const sub = this._userService
      .editUser({
        firstName: this.firstName,
        lastName: this.lastName,
        gender: this.gender as IGender,
      })
      .subscribe({
        next: (res) => {
          this.myUser = res.data;
          this.editingProfile = false;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.profileError = err.error?.message || 'Something went wrong';
          this._cdr.detectChanges();
        },
      });
    this.subscriptions.add(sub);
  }

  startAddAddress(): void {
    this.addressForm = this.emptyAddress();
    this.addressError = '';
    this.editingAddress = 'new';
  }
  startEditAddress(address: IAddress): void {
    const { _id, ...rest } = address;
    this.addressForm = rest;
    this.addressError = '';
    this.editingAddress = address._id;
  }
  cancelEditAddress(): void {
    this.editingAddress = null;
  }
  saveAddress(form: NgForm): void {
    if (form.invalid || !this.editingAddress) return;
    const request =
      this.editingAddress === 'new'
        ? this._userService.addAddress(this.addressForm)
        : this._userService.editAddress(this.editingAddress, this.addressForm);
    const sub = request.subscribe({
      next: (res) => {
        this.myUser = res.data;
        this.editingAddress = null;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.addressError = err.error?.message || 'Something went wrong';
        this._cdr.detectChanges();
      },
    });
    this.subscriptions.add(sub);
  }
  deleteAddress(addressId: string): void {
    const sub = this._userService.deleteAddress(addressId).subscribe({
      next: (res) => {
        this.myUser = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }
  setDefaultAddress(addressId: string): void {
    const sub = this._userService.setDefaultAddress(addressId).subscribe({
      next: (res) => {
        this.myUser = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
    this.subscriptions.add(sub);
  }

  private emptyAddress() {
    return {
      title: '',
      fullName: '',
      country: '',
      governorate: '',
      phoneNumber: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      isDefault: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
