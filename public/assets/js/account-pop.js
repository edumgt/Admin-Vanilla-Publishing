document.addEventListener("DOMContentLoaded", async function () {
   const navLinks = document.querySelectorAll(".nav-item a");
   const contentDiv = document.getElementById("content2");

   // Define pages BEFORE calling setActiveTab()
   const pages = {
      "Address": `
      <div class="row g-6">
          ${generateAddressForm("Office Address as per the record")}
          ${generateAddressForm("House Address as per the record")}
      </div>`,
      "Account": generateAccountSettings(),
      "Overview": "",  // Overview is empty initially; will be populated based on the selected user
      "Password": generatePasswordForm(),
   };

   let membersData = [];

   // Fetch members data
   try {
      const response = await fetch("/api/members");

      membersData = await response.json();
   } catch (error) {
      console.error("Error fetching members", error);
   }

   // Get user ID from URL parameters **before** using it
   const id = getQueryParam("id");

   // Initialize default tab (after id is initialized)
   setActiveTab("Overview");

   // Event listener for navigation links
   navLinks.forEach(link => {
      link.addEventListener("click", function (e) {
         e.preventDefault();
         setActiveTab(this.querySelector("span").textContent.trim());
      });
   });

   /**
    * Function to set active tab and update content
    */
   function setActiveTab(tabName) {
      navLinks.forEach(nav => nav.parentElement.classList.remove("active"));
      const activeNav = [...navLinks].find(link => link.querySelector("span").textContent.trim() === tabName);
      if (activeNav) activeNav.parentElement.classList.add("active");

      if (tabName === "Overview" && id) {
         const user = membersData.find(member => member.id === id);
         contentDiv.innerHTML = user
            ? generateUserContent(user)
            : "<div class='alert alert-danger'>User not found.</div>";
      } else {
         contentDiv.innerHTML = pages[tabName] || "<div class='alert alert-warning'>Page not found.</div>";
      }
   }

   /**
    * Function to get URL query parameter
    */
   function getQueryParam(param) {
      return new URLSearchParams(window.location.search).get(param);
   }

   /**
    * Function to generate user profile content
    */
   function generateUserContent(user) {
      return `
           <div class="card mb-6" >
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
                   ${generateUserDetailRow("Full Name", user.name)}
                   ${generateUserDetailRow("Employee ID", user.employeeId)}
                   ${generateUserDetailRow("Team", user.team)}
                   ${generateUserDetailRow("Join Year", user.joinYear)}
                   ${generateUserDetailRow("Email Address", user.email)}
                   ${generateUserDetailRow("Address", user.address)}
               </div>
           </div>`;
   }

   /**
    * Function to generate user detail rows
    */
   function generateUserDetailRow(label, value) {
      return `
           <div class="row mb-4">
               <div class="col-sm-12 col-lg-3 text-muted">${label}</div>
               <div class="col-sm-12 col-lg-9">${value}</div>
           </div>`;
   }

   /**
    * Function to generate address form
    */
   function generateAddressForm(title) {
      return `
       <div class="col-12 col-lg-6">
           <div class="card">
               <div class="card-body">
                   <h5 class="mb-6">${title}</h5>
                   <form method="GET" onsubmit="return false">
                       ${generateFormField("Address Type", "address-type", "text", "Official/Personal/Temp/Other etc.")}
                       ${generateFormField("Address", "address", "textarea", "Enter Address")}
                       ${generateFormField("State", "state", "text", "Enter State")}
                       ${generateFormField("Pin Code", "pinCode", "text", "Enter Pin Code", 6)}
                       <div class="mt-8">
                           <button type="submit" class="btn btn-primary me-1">Save Changes</button>
                           <button type="reset" class="btn btn-secondary">Reset</button>
                       </div>
                   </form>
               </div>
           </div>
       </div>`;
   }

   /**
    * Function to generate form field
    */
   function generateFormField(label, id, type, placeholder, maxlength = "") {
      return `
       <div class="mb-5">
           <label for="${id}" class="form-label mb-2">${label}</label>
           ${type === "textarea" ? `<textarea class="form-control" id="${id}" name="${id}" rows="3" placeholder="${placeholder}"></textarea>` : `<input class="form-control" type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" ${maxlength ? `maxlength="${maxlength}"` : ""}>`}
       </div>`;
   }

   /**
    * Function to generate account settings page
    */
   function generateAccountSettings() {
      return `
       <div class="card mb-6">
           <div class="card-body">
               <div class="d-flex align-items-start align-items-sm-center gap-6 pb-5 border-bottom">
                   <img src="sample/sample.svg" alt="user-avatar" class="d-block rounded" height="50px" id="uploadedAvatar">
                   <div>
                       <label for="upload" class="btn btn-primary me-1 mb-4">Upload Photo</label>
                       <input type="file" id="upload" hidden accept="image/png, image/jpeg">
                       <button class="btn btn-secondary mb-4">Reset</button>
                       <div>Allowed JPG, GIF or PNG. Max size of 100K</div>
                   </div>
               </div>
           </div>
           <div class="card-body pt-0">
               <form method="GET" onsubmit="return false">
                   ${generateFormField("Full Name", "fullName", "text", "Dollar Gill")}
                   ${generateFormField("Email Address", "emailAddress", "text", "gilldollar@gmail.com")}
                   ${generateFormField("Login ID", "loginID", "text", "gilldollar")}
                   ${generateFormField("Phone Number", "phoneNumber", "text", "Enter Phone Number")}
                   <div class="mt-6">
                       <button type="submit" class="btn btn-primary me-1">Save changes</button>
                       <button type="reset" class="btn btn-secondary">Reset</button>
                   </div>
               </form>
           </div>
       </div>`;
   }

   /**
    * Function to generate password change form
    */
   function generatePasswordForm() {
      return `
       <div class="card mb-6">
           <div class="card-body">
               <h5 class="mb-8">Change Password</h5>
               <form method="GET" onsubmit="return false">
                   ${generateFormField("Old Password", "old-password", "password", "························")}
                   ${generateFormField("New Password", "new-password", "password", "························")}
                   ${generateFormField("Confirm Password", "confirm-password", "password", "························")}
                   <div class="mt-6">
                       <button type="submit" class="btn btn-primary me-1">Save changes</button>
                       <button type="reset" class="btn btn-secondary">Reset</button>
                   </div>
               </form>
           </div>
       </div>`;
   }
});
