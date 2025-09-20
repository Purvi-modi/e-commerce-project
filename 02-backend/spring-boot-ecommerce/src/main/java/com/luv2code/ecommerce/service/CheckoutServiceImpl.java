package com.luv2code.ecommerce.service;

import com.luv2code.ecommerce.dao.CustomerRepository;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.entity.Address;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number;
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with order item
        Set<OrderItem> orderItems = purchase.getOrderItems();

        orderItems.forEach(order::add);     // Similar to: orderItems.forEach(item -> order.add(item));

        // populate order with billing address and shipping address
        Address billingAddress = purchase.getBillingAddress();
        Address shippingAddress = purchase.getShippingAddress();

        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);

        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to database
        // cascading all will save order
        // and cascading for address etc. in order will save addresses etc.
        customerRepository.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
