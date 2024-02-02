import React, { useEffect, useState } from 'react';
import './style.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);//use this when deal with Api pagination

  //https://www.youtube.com/watch?v=cBsB7hhOzQI&t=108s

  
  /* Summary
    
  States:
    products
    curPage=> page default to 1
    pageSize


  Display:
    allproducts:
      Slice products  
        page 0=> edge case return cannot go go to Zero
        page 1=> 0 - 10
        page 2=> 10 - 20
        .
        .
        .
        page N => (N-1 * 10) - (N * 10)

  Btns:
    Prev  = First page page <=1 is disabled(opacity=0)
    Next  = Last Page page>= products.length/10 is disabled(opacity=0)
    all generate pages=> productLength / 10

  Classes:
      page__disabled
      page__selected
    
  */

  async function fetchProducts() {
     let result = await fetch('https://dummyjson.com/products');
    //let result = await fetch(`https://dummyjson.com/products?limit=100&skip=${(page - 1) * 10}`);//use this when deal with Api pagination
    let response = await result.json();

    if (response?.products) {
      console.log(response);
      setProducts(response.products);
      setTotalPages(response.total);//coming from Api
    }
  }

  function handlePage(selectedPage) {
    //Edge condition
    if(selectedPage <1 || selectedPage>(products.length/pageSize) || selectedPage == page) return;

    setPage(selectedPage);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Pagination!</h1>
      <p>Start editing to see some magic happen :)</p>
    
    {/* Display products */}
      {products.length > 0 && (
        <div className="products">
          {products.slice((page - 1) * 10, page * 10).map((prd, i) => {
            return (
              <span className="product__single" key={i}>
                <img src={prd.thumbnail} alt={prd.description}></img>
                <p>{prd.title}</p>
              </span>
            );
          })}
        </div>
      )}

    {/* Display pagination */}
      {products.length > 0 && (
        <div className="pagination">

          <span onClick={() => handlePage(page - 1)} className={`   ${page <=1 ? "page__disabled" :''} `}>←</span>

          { Array(products.length / pageSize).fill(0).map((r, index) => {
              return (
                // <span key={index} onClick={() => handlePage(index + 1)} className={page == index + 1 ? "page__selected" :''}>{page}{index + 1}</span>
                <span key={index} onClick={() => handlePage(index + 1)} className={`   ${page == index + 1 ? "page__selected" :''} `}>{index + 1}</span>

              );
            })}

          <span onClick={() => handlePage(page + 1)}  className={`   ${page >= products.length/10 ? "page__disabled" :''} `}>→</span>
        </div>
      )}
    </div>
  );
}

/**
 * 
 * I always confuse in className , BOTH WORKS
 * className={page == index + 1 ? "page__selected" :''}
 * className={`   ${page == index + 1 ? "page__selected" :''} `}
 * 
 * 
 * 
 * Great example is iphone calculator 
 *   <button
      className={`
            btn ${content == 0 ? 'zero' : ''} 
            ${type == 'operator' ? 'operator' : ''} 
            ${type == 'function' ? 'function' : ''}
        `}

        onClick={()=>onButtonClick(content)}
    >
      {content}
    </button>
 */
