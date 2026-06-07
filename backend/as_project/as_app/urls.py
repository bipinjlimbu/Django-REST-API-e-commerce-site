from django.urls import path
from .views.auth_view import register_view, login_view, logout_view
from .views.main_view import user_view, single_profile_view, category_view, single_category_view, product_view, single_product_view, brand_view, single_brand_view, add_to_cart_view, cart_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('users/', user_view, name='user'),
    path('profile/<int:user_id>/', single_profile_view, name='single_profile'),
    path('category/', category_view, name='category'),
    path('category/<int:category_id>/', single_category_view, name='single_category'),
    path('product/', product_view, name='product'),
    path('product/<int:product_id>/', single_product_view, name='single_product'),
    path('brand/', brand_view, name='brand'),
    path('brand/<int:brand_id>/', single_brand_view, name='single_brand'),
    path('add-to-cart/<int:product_id>/', add_to_cart_view, name='add_to_cart'),
    path('cart/', cart_view, name='cart'),
]