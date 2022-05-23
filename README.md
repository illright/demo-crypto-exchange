Hi,

Please find below the exercise which is timeboxed to max 4 hours starting from now. The goal of the assignment is to demonstrate your design and coding skills. You can use your preferred programming language, libraries and frameworks.

Good luck!

*******************

Cryptocurrency Exchange

A cryptocurrency exchange accepts user orders, matches the orders and settles the (crypto)currencies. The goal of this assignment to create a simplified exchange front-end and back-end.


1) Place order

An order consists of a price, size, currency pair (e.g. BTC/USD) and the side (buy or sell). Price is expressed in base currency (e.g. USD) and size is expressed in traded currency (e.g. BTC).

Build an user interface to submit an order. Pay attentention to responsiveness, usability and seperaton of concerns (e.g. styling should be done with CSS).

Once the order is submitted in the front-end, the order is send to the back-end (http or websocket).
If you don't know how a (crypto) exchange front-end can look like, please have a look at https://www.binance.com/en/trade/BTC_USDT.


2) Backend-end

The back-end matches placed sell orders with existing buy orders in the orderbook and placed buy orders with existing sell orders in the orderbook.
The front-end orderbook (see section 3) should be notified by the back-end if an existing order is traded.
An new buy order trades with existing sell orders if the price equals or is higher than existing sell orders, or in case of a new sell order, if the price equals or is lower than existing buy orders.
If an existing order is traded, the existing order is removed from the front-end orderbook (see section 3).

Create a simple back-end which interacts with the front-end by means of http or websocket communication.


3) Orderbook

The orderbook displays the buy orders and sell orders. Any new placed order which does not trade directly with an order from the orderbook (see section 2) is added to the orderbook by the back-end and, notified to the front-end and displayed by the front-end. The front-end orderbook sorts the buy orders by price descending and the sell orders by price ascending.

Add an orderbook to the user interface created at section 1. Pay attention to responsiveness, usability and seperation of concerns (e.g. styling should be done with CSS).


--------

For simplicity, you can ignore the concept of an user (account). This means that all orders are inserted and matched without the existence of a counterparty (i.e. you are trading with yourself).

BONUS FEATURE: upon placing the order in section 1, add a confirmation dialog for the order price.
If the price of a placed buy order is more than 10% higher than the highest price of the orderbook's buy orders, or if the price of a placed sell order is more than 10% lower than the lowest price of the orderbook's sell orders, a confirmation dialog or a message should popup in order to confirm the order.

*******************
