package com.luv2code.ecommerce.config;

import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {


    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] unsupportedActions = { HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT};

        //disable http methods for product: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        //disable http methods for product category: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // call internal helper method
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config)
    {
            // expose entity ids

            // get a list of all entity classes from entity manager
            Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

            // - create an array of the entity types
            List<Class> entityClasses = new ArrayList<>();

            // get the entity type for entities
            for(EntityType tempEntityType: entities)
            {
                entityClasses.add(tempEntityType.getJavaType());
            }

            // expose the entity ids for the array of entity/domain types
            Class[] domainTypes = entityClasses.toArray(new Class[0]);
            config.exposeIdsFor(domainTypes);
    }
}
