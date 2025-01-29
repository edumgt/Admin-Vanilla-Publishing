document.addEventListener("DOMContentLoaded", function () {
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
                           <div class="dropdown">
                              <a href="#" class="dropdown-toggle text-body">
                                 <i class="bx bx-dots-horizontal-rounded fs-4"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-up-arrow-circle fs-4"></i>
                                       <span>Move up</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-down-arrow-circle fs-4"></i>
                                       <span>Move down</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-divider"></div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-trash fs-4"></i>
                                       <span>Delete this address</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-plus-circle fs-4"></i>
                                       <span>Add new address</span>
                                    </div>
                                 </div>

                              </div>
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
                           <div class="dropdown">
                              <a href="#" class="dropdown-toggle text-body">
                                 <i class="bx bx-dots-horizontal-rounded fs-4"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-up-arrow-circle fs-4"></i>
                                       <span>Move up</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-down-arrow-circle fs-4"></i>
                                       <span>Move down</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-divider"></div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-trash fs-4"></i>
                                       <span>Delete this address</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-plus-circle fs-4"></i>
                                       <span>Add new address</span>
                                    </div>
                                 </div>

                              </div>
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
                              <h5 class="text-truncate">Other Address as per the record</h5>
                           </div>
                           <div class="dropdown">
                              <a href="#" class="dropdown-toggle text-body">
                                 <i class="bx bx-dots-horizontal-rounded fs-4"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-up-arrow-circle fs-4"></i>
                                       <span>Move up</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-down-arrow-circle fs-4"></i>
                                       <span>Move down</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-divider"></div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-trash fs-4"></i>
                                       <span>Delete this address</span>
                                    </div>
                                 </div>
                                 <div class="dropdown-item">
                                    <div class="d-flex align-items-center gap-2">
                                       <i class="bx bx-plus-circle fs-4"></i>
                                       <span>Add new address</span>
                                    </div>
                                 </div>

                              </div>
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
                        <img src="assets/img/Avatars/Lalina.png" alt="user-avatar"
                           class="d-block rounded bg-primary-medium" height="100px" id="uploadedAvatar">
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
    "Overview": `<div class="card mb-6">
               <div class="card-body">
                  <div class="d-flex align-items-center gap-6 pb-5 border-bottom">
                     <img src="assets/img/Avatars/Lalina.png" alt="user-avatar"
                        class="d-block rounded bg-primary-lightest" height="100px" id="uploadedAvatar">
                     <div>
                        <h5>Dollar Gill</h5>
                        <div>Admin</div>
                     </div>
                  </div>
               </div>
               <div class="card-body pt-0">
                  <div class="row mb-4">
                     <div class="col-sm-12 col-lg-3 text-muted">Full Name</div>
                     <div class="col-sm-12 col-lg-9">Dollar Gill</div>
                  </div>
                  <div class="row mb-4">
                     <div class="col-sm-12 col-lg-3 text-muted">Email Address</div>
                     <div class="col-sm-12 col-lg-9">gilldollar@gmail.com</div>
                  </div>
                  <div class="row mb-4">
                     <div class="col-sm-12 col-lg-3 text-muted">Login ID</div>
                     <div class="col-sm-12 col-lg-9">gilldollar</div>
                  </div>
                  <div class="row mb-4">
                     <div class="col-sm-12 col-lg-3 text-muted">Status</div>
                     <div class="col-sm-12 col-lg-9">
                        <span class="badge bg-label-success rounded">Active</span>
                     </div>
                  </div>
                  <div class="row mb-4">
                     <div class="col-sm-12 col-lg-3 text-muted">Phone Number</div>
                     <div class="col-sm-12 col-lg-9">NA</div>
                  </div>
                  <div class="mt-8">
                     <a href="account.html" class="btn btn-primary">Edit Account</a>
                  </div>
               </div>
            </div>
      
      `,
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
          if (pages[tabName]) {
              contentDiv.innerHTML = pages[tabName];
          }
      });
  });
});
