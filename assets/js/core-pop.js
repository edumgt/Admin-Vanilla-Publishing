document.addEventListener("DOMContentLoaded", async function () {
   const navLinks = document.querySelectorAll(".nav-item a");
   const contentDiv = document.getElementById("content");

   const pages = {
      "Address": `
      <div class="row g-6">
               <div class="col-12 col-lg-6">
                  <div class="card">
                     <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between mb-6">
                           <div class="w-80">
                              <h5 class="text-truncate">Office Address as per the record</h5>
                           </div>
                           
                        </div>
                        <form id="formAccountAddress" method="GET" onsubmit="return false">
                           <div class="mb-5">
                              <label for="address-type" class="form-label mb-2">Address Type</label>
                              <input class="form-control" type="text" id="address-type" name="address-type"
                                 placeholder="Official/Personal/Temp/Other etc." autofocus>
                           </div>
                           <div class="mb-5">
                              <label for="address" class="form-label mb-2">Address</label>
                              <textarea class="form-control" id="address" name="address" rows="3"
                                 placeholder="Enter Address"></textarea>
                           </div>
                           <div class="mb-5">
                              <label for="state" class="form-label mb-2">State</label>
                              <input class="form-control" type="text" id="state" name="state" placeholder="Enter State">
                           </div>
                           <div class="mb-5">
                              <label for="pinCode" class="form-label mb-2">Pin Code</label>
                              <input type="text" class="form-control" id="pinCode" name="pinCode"
                                 placeholder="Enter Pin Code" maxlength="6">
                           </div>
                           <div class="mt-8">
                              <button type="submit" class="btn btn-primary me-1">Save Changes</button>
                              <button type="reset" class="btn btn-secondary">Reset</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
               <div class="col-12 col-lg-6">
                  <div class="card">
                     <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between mb-6">
                           <div class="w-80">
                              <h5 class="text-truncate">House Address as per the record</h5>
                           </div>
                           
                        </div>
                        <form id="formAccountAddress" method="GET" onsubmit="return false">
                           <div class="mb-5">
                              <label for="address-type" class="form-label mb-2">Address Type</label>
                              <input class="form-control" type="text" id="address-type" name="address-type"
                                 placeholder="Official/Personal/Temp/Other etc." autofocus>
                           </div>
                           <div class="mb-5">
                              <label for="address" class="form-label mb-2">Address</label>
                              <textarea class="form-control" id="address" name="address" rows="3"
                                 placeholder="Enter Address"></textarea>
                           </div>
                           <div class="mb-5">
                              <label for="state" class="form-label mb-2">State</label>
                              <input class="form-control" type="text" id="state" name="state" placeholder="Enter State">
                           </div>
                           <div class="mb-5">
                              <label for="pinCode" class="form-label mb-2">Pin Code</label>
                              <input type="text" class="form-control" id="pinCode" name="pinCode"
                                 placeholder="Enter Pin Code" maxlength="6">
                           </div>
                           <div class="mt-8">
                              <button type="submit" class="btn btn-primary me-1">Save Changes</button>
                              <button type="reset" class="btn btn-secondary">Reset</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
               
            </div>
      `,
      "Account": `
          <div class="card mb-6">
                  <div class="card-body">
                     <div class="d-flex align-items-start align-items-sm-center gap-6 pb-5 border-bottom">
                        <img src="sample/sample.svg" alt="user-avatar"
                           class="d-block rounded " height="50px" id="uploadedAvatar">
                        <div>
                           <label for="upload" class="btn btn-primary me-1 mb-4">
                              <span class="d-none d-sm-block">Upload Photo</span>
                              <i class="bx bx-upload d-block d-sm-none"></i>
                              <input type="file" id="upload" class="" hidden accept="image/png, image/jpeg">
                           </label>
                           <button class="btn btn-secondary mb-4">
                              <i class="bx bx-reset d-block d-sm-none"></i>
                              <span class="d-none d-sm-block">Reset</span>
                           </button>
                           <div>Allowed JPG, GIF or PNG. Max size of 100K</div>
                        </div>
                     </div>
                  </div>
                  <div class="card-body pt-0">
                     <form id="formAccountSettings" method="GET" onsubmit="return false">
                        <div class="row g-6">
                           
                        
                           <div class="col-md-6">
                              <label for="fullName" class="form-label mb-2">Full Name</label>
                              <input class="form-control" type="text" id="fullName" name="fullName" value="Dollar Gill"
                                 autofocus>
                           </div>
                           <div class="col-md-6">
                              <label for="emailAddress" class="form-label mb-2">Email Address</label>
                              <input class="form-control" type="text" id="emailAddress" name="emailAddress"
                                 value="gilldollar@gmail.com" placeholder="Enter Email Address">
                           </div>
                           <div class="col-md-6">
                              <label for="loginID" class="form-label mb-2">Login ID</label>
                              <input type="text" class="form-control" id="loginID" name="loginID" value="gilldollar"
                                 placeholder="Enter Login ID">
                           </div>
                           <div class="col-md-6">
                              <label class="form-label mb-2" for="phoneNumber">Phone Number</label>
                              <input type="text" id="phoneNumber" name="phoneNumber" class="form-control"
                                 placeholder="Enter Phone Number">
                           </div>

                        </div>
                        <div class="mt-6">
                           <button type="submit" class="btn btn-primary me-1">Save changes</button>
                           <button type="reset" class="btn btn-secondary">Reset</button>
                        </div>
                     </form>
                  </div>
               </div>
               <div class="card">
                  <h5 class="p-6">Delete</h5>
                  <div class="px-6 pb-6">
                     <div class="col-12">
                        <div class="alert alert-warning">
                           <h5 class="color-inherit mb-1">Are you sure you want to delete your account?</h5>
                           <p class="mb-0">Once you delete your account, there is no going back.</p>
                        </div>
                     </div>
                     <form id="formAccountDeactivation" onsubmit="return false">
                        <div class="form-check my-8">
                           <input class="form-check-input" type="checkbox" name="accountActivation"
                              id="accountActivation">
                           <label class="form-check-label" for="accountActivation">I confirm my account
                              deletion</label>
                        </div>
                        <button type="submit" class="btn btn-danger" disabled>Delete Account</button>
                     </form>
                  </div>
               </div>
          `
      ,
      "Overview": ``,
      "Password": `<div class="card mb-6">
               <div class="card-body">
                  <h5 class="mb-8">Change Password</h5>
                  <form id="formAccountPasword" method="GET" onsubmit="return false">
                     <div class="mb-4">
                        <label class="form-label mb-2" for="old-password">Old Password</label>
                        <input id="old-password" type="password" class="form-control"
                           placeholder="························" name="old-password" autofocus>
                     </div>
                     <div class="mb-4">
                        <label class="form-label mb-2" for="new-password">New Password</label>
                        <input id="new-password" type="password" class="form-control"
                           placeholder="························" name="new-password">
                     </div>
                     <div class="mb-4">
                        <label class="form-label mb-2" for="confirm-password">Confirm Password</label>
                        <input id="confirm-password" type="password" class="form-control"
                           placeholder="························" name="confirm-password">
                     </div>
                     <div class="mt-6">
                        <button type="submit" class="btn btn-primary me-1">Save changes</button>
                        <button type="reset" class="btn btn-secondary">Reset</button>
                     </div>
                  </form>
               </div>
            </div>
      
      `
   };

   // Set default view to Overview
   contentDiv.innerHTML = pages["Overview"];
   document.querySelector(".nav-item:first-child").classList.add("active");

   navLinks.forEach(link => {
      link.addEventListener("click", function (e) {
         e.preventDefault();

         // Remove active class from all tabs
         navLinks.forEach(nav => nav.parentElement.classList.remove("active"));

         // Add active class to clicked tab
         this.parentElement.classList.add("active");

         // Get the tab name
         const tabName = this.querySelector("span").textContent.trim();


         // Update content
         //if (pages[tabName]) {
         if (tabName === "Overview") {
            console.log("tabName: " + tabName);
            if (id) {
               var user = membersData.find(member => member.id === id);

               if (user) {
                  contentDiv.innerHTML = generateUserContent(user);
               } else {
                  contentDiv.innerHTML = "<div class='alert alert-danger'>User not found.</div>";
               }
            } else {
               contentDiv.innerHTML = "<div class='alert alert-warning'>No user selected.</div>";
            }
         } else {
            contentDiv.innerHTML = pages[tabName];
         }
         //}
      });
   });


   let membersData = [];
   try {
      const response = await fetch("assets/mock/members.json");
      membersData = await response.json();
      //console.log(membersData);
   } catch (error) {
      console.error("Error fetching members.json:", error);
   }


   function generateUserContent(user) {
      return `
           <div class="card mb-6">
               <div class="card-body">
                   <div class="d-flex align-items-center gap-6 pb-5 border-bottom">
                       <img src="sample/sample.svg" alt="user-avatar"
                           class="d-block rounded bg-primary-lightest" height="50px" id="uploadedAvatar">
                       <div>
                           <h5>${user.name}</h5>
                           <div>${user.team}</div>
                       </div>
                   </div>
               </div>
               <div class="card-body pt-0">
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Full Name</div>
                       <div class="col-sm-12 col-lg-9">${user.name}</div>
                   </div>
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Employee ID</div>
                       <div class="col-sm-12 col-lg-9">${user.employeeId}</div>
                   </div>
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Team</div>
                       <div class="col-sm-12 col-lg-9">${user.team}</div>
                   </div>
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Join Year</div>
                       <div class="col-sm-12 col-lg-9">${user.joinYear}</div>
                   </div>
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Email Address</div>
                       <div class="col-sm-12 col-lg-9">${user.email}</div>
                   </div>
                   <div class="row mb-4">
                       <div class="col-sm-12 col-lg-3 text-muted">Address</div>
                       <div class="col-sm-12 col-lg-9">${user.address}</div>
                   </div>
               </div>
           </div>
       `;
   }

   function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
   }

   const name = getQueryParam("name");
   const id = getQueryParam("id");
   // if (name) {
   //    document.querySelector(".name-display").textContent = `User: ${decodeURIComponent(name)} [ ${decodeURIComponent(id)} ]`;
   // } else {
   //    document.querySelector(".name-display").textContent = "No user data found.";
   // }

   //console.log(id);
   if (id) {
      var user = membersData.find(member => member.id === id);

      if (user) {
         contentDiv.innerHTML = generateUserContent(user);
      } else {
         contentDiv.innerHTML = "<div class='alert alert-danger'>User not found.</div>";
      }
   } else {
      contentDiv.innerHTML = "<div class='alert alert-warning'>No user selected.</div>";
   }

});