package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Automatically calls search by category column
    // Query: Select * from product where category_id=?
    /*
        Route: https://localhost:8080/api/products/search/findByCategoryId?id=1

        here, for this find by method we need to add /search in url
     */
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    /*
     Route: https://localhost:8080/api/products/search/findByNameContaining?name=Python

     here, for this find by method we need to add /search in url

     Query:
     Select * from Product p
     Where
     p.name like CONCAT('%', :name, '%');
     eg: name: Crash Course in Python
  */
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
