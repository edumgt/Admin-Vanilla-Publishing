const body = document.querySelector('body');

//////////////////// Accordions ////////////////////

const accordionHeaders = document.querySelectorAll(
  '.accordion .accordion-header'
);

accordionHeaders.forEach((accordionHeader) =>
  accordionHeader.addEventListener('click', (event) => {
    const curentAccordionItem = accordionHeader.closest('.accordion-item');
    const parentName = curentAccordionItem.getAttribute('parent');

    if (parentName !== '') {
      const parent = document.getElementById(parentName);
      if (parent) {
        const accordionItems = parent.querySelectorAll('.accordion-item');
        accordionItems.forEach((accordionItem) => {
          if (accordionItem !== curentAccordionItem) {
            if (accordionItem.getAttribute('parent') === parentName) {
              accordionItem.classList.remove('open');
            }
          }
        });
      }
    }
    curentAccordionItem.classList.toggle('open');
    event.stopPropagation();
  })
);

//////////////////// Alerts ////////////////////

const alertDismissButtons = document.querySelectorAll(
  '.alert-dismissible .btn-close'
);

alertDismissButtons.forEach((alertDismissButton) =>
  alertDismissButton.addEventListener('click', (event) => {
    const alertDismiss = alertDismissButton.closest('.alert-dismissible');
    alertDismiss.classList.add('d-none');
    event.stopPropagation();
  })
);

//////////////////// Dropdown ////////////////////

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) =>
  dropdownToggle.addEventListener('click', (event) => {
    const dropdown = dropdownToggle.closest('.dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    hideAllDropdowns(event);
    dropdownMenu.classList.toggle('show');
    event.stopPropagation();
  })
);

function hideAllDropdowns(event) {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  dropdownMenus.forEach((dropdownMenu) => {
    if (dropdownMenu.classList.contains('show')) {
      const dropdown = dropdownMenu.closest('.dropdown');
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
      if (event.currentTarget !== dropdownToggle) {
        dropdownMenu.classList.remove('show');
      }
    }
  });
}

//////////////////// Modal (except ModalConfirm) ////////////////////

const modals = document.querySelectorAll('.modal:not(.modal-confirm)');
const modalDialogs = document.querySelectorAll(
  '.modal:not(.modal-confirm) .modal-dialog'
);
const modalContents = document.querySelectorAll(
  '.modal:not(.modal-confirm) .modal-content'
);
const modalToggles = document.querySelectorAll(
  '.modal:not(.modal-confirm) [data-toggle="modal"]'
);
const modalDismissToggles = document.querySelectorAll(
  '.modal:not(.modal-confirm) [data-dismiss="modal"]'
);

// Show modal if modal toggle clicked
modalToggles.forEach((modalToggle) =>
  modalToggle.addEventListener('click', (event) => {
    hideAllDropdowns(event);
    const modalID = modalToggle.getAttribute('data-target');
    if (modalID) {
      const modal = document.getElementById(modalID);
      if (modal) {
        showModal(modal);
      }
    }
    event.stopPropagation();
  })
);

// Hide modal if modal dismiss toggle clicked
modalDismissToggles.forEach((modalDismissToggle) =>
  modalDismissToggle.addEventListener('click', (event) => {
    const modal = modalDismissToggle.closest('.modal');
    if (modal) {
      hideModal(modal);
    }
    event.stopPropagation();
  })
);

// Hide model when clicked outside model-content
modalDialogs.forEach((modalDialog) =>
  modalDialog.addEventListener('click', (event) => {
    if (event.target === modalDialog) {
      const modal = modalDialog.closest('.modal');
      hideModal(modal);
      event.stopPropagation();
    }
  })
);

// Hide model when clicked outside model-content
modals.forEach((modal) =>
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal(modal);
      event.stopPropagation();
    }
  })
);

function showModal(modal) {
  const backdrop = document.createElement('div');
  backdrop.id = 'modalBackdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('data-target', modal.id);
  document.body.appendChild(backdrop);
  modal.classList.add('show');
}

function hideModal(modal) {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.remove();
  }
  modal.classList.remove('show');
}

//////////////////// ModalConfirm ////////////////////

function modalConfirm(message) {
  return new Promise((resolve) => {
    showModal(modal);

    buttonOK.onclick = () => {
      hideModal(modal);
      resolve(true);
    };

    buttonCancel.onclick = () => {
      hideModal(modal);
      resolve(false);
    };

    function showModal(modal) {
      const backdrop = document.createElement('div');
      backdrop.id = 'modalBackdrop';
      backdrop.className = 'modal-backdrop';
      backdrop.setAttribute('data-target', modal.id);
      document.body.appendChild(backdrop);
      modal.classList.add('show');
    }

    function hideModal(modal) {
      const backdrop = document.getElementById('modalBackdrop');
      if (backdrop) {
        backdrop.remove();
      }
      modal.classList.remove('show');
    }

    function createBackdrop() {
      const backdrop = document.createElement('div');
      backdrop.id = 'modalConfirmBackdrop';
      backdrop.className = 'modal-confirm-backdrop';
      document.body.appendChild(backdrop);
    }

    function removeBackdrop() {
      const backdrop = document.getElementById('modalConfirmBackdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }

    function createModal() {
      const modal = document.createElement('div');
      modal.id = 'modal-confirm';
      modal.className = 'modal modal-confirm';
      document.body.appendChild(modal);

      const modalDialog = document.createElement('div');
      modalDialog.className = 'modal-dialog modal-dialog-centered';
      modal.appendChild(modalDialog);

      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalDialog.appendChild(modalContent);

      const modalHeader = document.createElement('div');
      modalHeader.className = 'modal-header';
      modalContent.appendChild(modalHeader);

      headerChildDiv = document.createElement('div');
      headerChildDiv.className = 'd-flex';
      modalHeader.appendChild(headerChildDiv);

      modalHeading = document.createElement('h6');
      modalHeading.innerText = 'Confirm';
      headerChildDiv.appendChild(modalHeading);

      const modalBody = document.createElement('div');
      modalBody.className = 'modal-body';
      modalContent.appendChild(modalBody);

      const messagePara = document.createElement('p');
      messagePara.className = 'mb-2';
      messagePara.innerText = message;
      modalBody.appendChild(messagePara);

      const modalFooter = document.createElement('div');
      modalFooter.className = 'modal-footer';
      modalContent.appendChild(modalFooter);

      const footerDiv = document.createElement('div');
      footerDiv.className = 'd-flex align-items-center gap-2';
      modalFooter.appendChild(footerDiv);

      buttonOK = document.createElement('button');
      buttonOK.className = 'btn btn-primary';
      buttonOK.innerText = 'OK';
      footerDiv.appendChild(buttonOK);

      buttonCancel = document.createElement('button');
      buttonCancel.className = 'btn btn-secondary';
      buttonCancel.innerText = 'Cancel';
      footerDiv.appendChild(buttonCancel);
    }
  });
}

//////////////////// Nav ////////////////////

const navItems = document.querySelectorAll('.nav>.nav-item');

navItems.forEach((navItem) =>
  navItem.addEventListener('click', (event) => {
    clearNavItemActive(navItem);
    navItem.classList.add('active');
    event.stopPropagation();
  })
);

function clearNavItemActive(currentNavItem) {
  navItems.forEach((navItem) => {
    if (navItem !== currentNavItem) {
      navItem.classList.remove('active');
    }
  });
}

/////////////////// Sidebar ////////////////////

// Sidebar Menu
const menuItems = document.querySelectorAll('.menu>.menu-item');

menuItems.forEach((menuItem) =>
  menuItem.addEventListener('click', (event) => {
    clearMenuItemOpenActive(menuItem);
    menuItem.classList.add('active');
    menuItem.classList.toggle('open');
    event.stopPropagation();
  })
);

// Sidebar Sub-Menu
const menuSubItems = document.querySelectorAll('.menu-sub>.menu-item');

menuSubItems.forEach((menuSubItem) =>
  menuSubItem.addEventListener('click', (event) => {
    clearMenuSubItemActive(menuSubItem);

    const menuSubSub = menuSubItem.querySelectorAll('.menu-sub');

    if (menuSubSub.length > 0) {
      menuSubItem.classList.toggle('open');
    } else {
      menuSubItem.classList.add('active');
    }

    event.stopPropagation();
  })
);

function clearMenuItemOpenActive(currentMenuItem) {
  menuItems.forEach((menuItem) => {
    if (menuItem !== currentMenuItem) {
      menuItem.classList.remove('active');
      menuItem.classList.remove('open');
    }
  });
}

function clearMenuSubItemActive(currentMenuSubItem) {
  menuSubItems.forEach((menuSubItem) => {
    if (menuSubItem !== currentMenuSubItem) {
      menuSubItem.classList.remove('active');
    }
  });
}

// Hide Sidebar when Sidebar Backdrop is clicked
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
sidebarBackdrop.addEventListener('click', () => {
  document.body.classList.add('sidebar-hidden');
});

//////////////////// Click on Empty Area ////////////////////

document.addEventListener('click', (event) => {
  hideAllDropdowns(event);
});

const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const toggleIcon = sidebarToggle.querySelector('i');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');

        // 아이콘 변경
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.replace('bx-chevron-left', 'bx-chevron-right');
        } else {
            toggleIcon.classList.replace('bx-chevron-right', 'bx-chevron-left');
        }
    });



