package com.luv2code.ecommerce.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data // generates constructor
public class PurchaseResponse {

    // @Data generates constructor only for final fields
    // Or @NonNull is also fine
    private final String orderTrackingNumber;
}
