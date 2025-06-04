<script>
    import { storeInfo, accentColor } from '$lib/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let storeInfoTemp;
    let color;

    onMount(()=> {
        if (browser) {
            storeInfoTemp = $storeInfo;
            color = $accentColor
        }
    })

</script>

<style>
         button.go_back {
        outline: none;
        background: none;
        border: none;
        margin: 1rem;
    }
    .store-card {
      margin-top: 0.5rem;
      padding: 10px;
      border-radius: 10px;
      box-shadow: none;
      margin-bottom: 7rem;
    }
  
    .store-icon {
      font-size: 1.5rem;
      color: #404040; /* Custom color for the icons */
    }
  
    .store-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: larger;
      gap: 1rem;
    }
  
    .store-info-item p {
      margin-left: 15px;
      margin: 0;
    }
  
    .store-image-container {
        text-align: center;
    }

    .store-image {
      width: 5rem;
      height: auto;
      border-radius: 10px;
      margin-bottom: 20px;
      
    }
  </style>

  <div class="container">
    <button 
    on:click={()=>location.href='/dashboard'}
    class="go_back">
    <i class="material-icons">arrow_back</i>
  </button>
    <div class="card store-card">
      
      <div class="store-image-container">
        <!-- Store Image -->
      <img src={storeInfoTemp?.stockPicture} alt="Stock Image" class="store-image" />
  
      </div>








      <ul class="collection">
        
        <li class="collection-item avatar">
          <i class="material-icons circle pink">store</i>
          <span class="title"><b>Business Name</b></span>
          <p>{storeInfoTemp?.businessName} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle purple">location_on</i>
          <span class="title"><b>Address</b></span>
          <p>{storeInfoTemp?.address} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle indigo">location_city</i>
          <span class="title"><b>City</b></span>
          <p>{storeInfoTemp?.city} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle blue">email</i>
          <span class="title"><b>Email</b></span>
          <p>{storeInfoTemp?.email} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle amber">phone</i>
          <span class="title"><b>Phone Number</b></span>
          <p>{storeInfoTemp?.whatsAppPhoneNumber} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle orange">attach_money</i>
          <span class="title"><b>Price Range</b></span>
          <p>{storeInfoTemp?.productPriceRange} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle red">inventory</i>
          <span class="title"><b>Product Stock</b></span>
          <p>{storeInfoTemp?.perProductStock} <br>
             
          </p>
         
        </li>

        <li class="collection-item avatar">
          <i class="material-icons circle yellow">calendar_today</i>
          <span class="title"><b>Date Established</b></span>
          <p>{new Date(storeInfoTemp?.createdAt).toLocaleDateString()} <br>
             
          </p>
         
        </li>
        
      </ul>












<!-- 

      <div class="store-info-item">
        <i class="material-icons store-icon">store</i>
        <p><strong>{storeInfoTemp?.businessName}</strong></p>
      </div>
  
      <div class="store-info-item">
        <i class="material-icons store-icon">location_on</i>
        <p>{storeInfoTemp?.address}</p>
      </div>

      <div class="store-info-item">
        <i class="material-icons store-icon">location_city</i>
        <p>{storeInfoTemp?.city}</p>
      </div>
  
      <div class="store-info-item">
        <i class="material-icons store-icon">email</i>
        <p>{storeInfoTemp?.email}</p>
      </div>
  
      <div class="store-info-item">
        <i class="material-icons store-icon">phone</i>
        <p>{storeInfoTemp?.whatsAppPhoneNumber}</p>
      </div>
  
      
      <div class="store-info-item">
        <i class="material-icons store-icon">attach_money</i>
        <p>Price Range: {storeInfoTemp?.productPriceRange}</p>
      </div>
  
      <div class="store-info-item">
        <i class="material-icons store-icon">inventory</i>
        <p>Stock: {storeInfoTemp?.perProductStock}</p>
      </div>
  
      <div class="store-info-item">
        <i class="material-icons store-icon">calendar_today</i>
        <p>Established: {new Date(storeInfoTemp?.createdAt).toLocaleDateString()}</p>
      </div> -->
    </div> 
  </div>