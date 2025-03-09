const CHOSEONG_LIST = [
    "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ",
    "ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ",
    "ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
  ];
  function getHangulInitial(str) {
    if (!str || typeof str !== "string") return "";
    const c = str.trim().charAt(0);
    const code = c.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11172) return "";
    const idx = Math.floor(code / (21 * 28));
    return CHOSEONG_LIST[idx] || "";
  }

  
  let glossaryData = [];
  let filteredData = [];
  const PAGE_SIZE = 20;
  let currentPage = 1;
  let totalPages = 1;

 
  function loadGlossaryData() {
    const stored = localStorage.getItem("glosData");
    if (stored) {
      console.log("로컬스토리지(glosData)에서 불러옵니다.");
      glossaryData = JSON.parse(stored);
      filteredData = glossaryData;
      totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
      displayPage(1);
    } else {
      console.log("서버(/api/glos)에서 JSON을 가져와 localStorage에 저장합니다...");
      fetch("/api/glos")
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("glosData", JSON.stringify(data));
          glossaryData = data;
          filteredData = data;
          totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
          displayPage(1);
        })
        .catch(err => {
          console.error("/api/glos 가져오기 실패:", err);
        });
    }
  }

  // ============ PC 모달 UI 참조 ============
  const detailModal = document.getElementById("detailModal");
  const modalClose = document.querySelector(".modal-close");
  const modalEn = document.getElementById("modalEn");
  const modalKo = document.getElementById("modalKo");
  const modalDesc = document.getElementById("modalDesc");
  const modalImg = document.getElementById("modalImg");

  // 정정요청 영역 (PC)
  const correctionForm = document.getElementById("correctionForm");
  const correctionText = document.getElementById("correctionText");
  const saveCorrectionBtn = document.getElementById("saveCorrectionBtn");

  const mobileCorrectionText = document.getElementById("mobileCorrectionText");
  const mobileSaveCorrectionBtn = document.getElementById("mobileSaveCorrectionBtn");

  // ============ (3) PC 모달 열기 ============
  function openModal(item) {
    modalEn.textContent = item.en;
    modalKo.textContent = item.ko;
    modalDesc.textContent = item.desc;

    document.getElementById("modalGlosId").value = item.id;
    console.log(document.getElementById("modalGlosId").value);

    correctionForm.style.display = "none";
    correctionText.value = "";

    // 이미지 처리
    if (item.img) {
      modalImg.src = item.img;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }
    detailModal.classList.add("active");
  }
  function closeModal() {
    detailModal.classList.remove("active");
  }
  modalClose.addEventListener("click", closeModal);
  detailModal.addEventListener("click", e => {
    if (e.target === detailModal) {
      closeModal();
    }
  });

  // 모달 뱃지 버튼 (PC/모바일 공용)
  document.addEventListener("click", e => {
    if (e.target.classList.contains("modal-badge-btn")) {
      const action = e.target.dataset.action;
      if (window.innerWidth <= 600) {
        // 모바일
        if (action === "request-correction") {
          document.getElementById("mobileCorrectionForm").style.display = "block";
        } else {
          alert(`(모바일) '${action}' 버튼 클릭`);
        }
      } else {
        // PC
        if (action === "request-correction") {
          correctionForm.style.display = "block";
        } else {
          alert(`(PC) '${action}' 버튼 클릭`);
        }
      }
    }
  });

  saveCorrectionBtn.addEventListener("click", () => {
    const msg = correctionText.value.trim();
    if (!msg) {
      alert("정정 요청 내용을 입력하세요.");
      return;
    }
    

    const itemId = document.getElementById("modalGlosId").value;
    console.log(itemId);
    
    // 서버로 POST
    fetch("/api/glos_req", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        glos_id: itemId,
        req_msg: msg
      })
    })
    .then(res => res.json())
    .then(result => {

      alert(`정정 요청이 저장되었습니다.\n\n내용: ${msg}\n서버응답: ${result.message}`);

      correctionForm.style.display = "none";
    })
    .catch(err => {
      console.error("정정 요청 실패:", err);
      alert("정정 요청 전송 중 오류가 발생했습니다.");
    });
  });

  mobileSaveCorrectionBtn.addEventListener("click", () => {
    const msg = mobileCorrectionText.value.trim();
    if (!msg) {
      alert("정정 요청 내용을 입력하세요.");
      return;
    }
    

    const itemId = document.getElementById("modalGlosId2").value;
    console.log(itemId);
    
    // 서버로 POST
    fetch("/api/glos_req", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        glos_id: itemId,
        req_msg: msg
      })
    })
    .then(res => res.json())
    .then(result => {

      alert(`정정 요청이 저장되었습니다.\n\n내용: ${msg}\n서버응답: ${result.message}`);

      correctionForm.style.display = "none";
    })
    .catch(err => {
      console.error("정정 요청 실패:", err);
      alert("정정 요청 전송 중 오류가 발생했습니다.");
    });
  });


  function openDetailView(item) {
    if (window.innerWidth <= 600) {
      
      document.getElementById("mainContainer").style.display = "none";
      const mobileDetailView = document.getElementById("mobileDetailView");
      mobileDetailView.style.display = "block";

      document.getElementById("mobileEn").textContent = item.en;
      document.getElementById("mobileKo").textContent = item.ko;
      document.getElementById("mobileDesc").textContent = item.desc;

      document.getElementById("modalGlosId2").value = item.id;
      console.log(document.getElementById("modalGlosId2").value);

      const mobileImg = document.getElementById("mobileImg");
      if (item.img) {
        mobileImg.src = item.img;
        mobileImg.style.display = "block";
      } else {
        mobileImg.style.display = "none";
      }
      
      document.getElementById("mobileCorrectionForm").style.display = "none";
      document.getElementById("mobileCorrectionText").value = "";

    } else {

      openModal(item);
    }
  }


  document.getElementById("mobileBackBtn").addEventListener("click", () => {
    document.getElementById("mobileDetailView").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
  });

  
  function renderGlossaryList(data) {
    const glossaryEl = document.getElementById("glossary");
    glossaryEl.innerHTML = "";

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("role", "listitem");


      const dtEn = document.createElement("dt");
      dtEn.textContent = item.en;
      dtEn.className = "en";


      const dtKo = document.createElement("dt");
      dtKo.textContent = item.ko;
      dtKo.className = "ko";


      let shortDesc = item.desc;
      if (shortDesc.length > 20) {
        shortDesc = shortDesc.slice(0, 20) + "...";
      }
      const ddDesc = document.createElement("dd");
      ddDesc.textContent = shortDesc;
      ddDesc.className = "desc";


      const detailBtn = document.createElement("button");
      detailBtn.className = "detail-btn";
      detailBtn.textContent = "상세보기";
      detailBtn.addEventListener("click", () => {
        openDetailView(item);
      });

      card.appendChild(dtEn);
      card.appendChild(dtKo);
      card.appendChild(ddDesc);
      card.appendChild(detailBtn);

      glossaryEl.appendChild(card);
    });
  }

  // ============ (6) 페이지별 표시 ============
  function displayPage(pageNum) {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    currentPage = pageNum;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filteredData.slice(start, end);

    renderGlossaryList(pageData);
    document.getElementById("searchCount").textContent =
      `검색 결과: ${filteredData.length}건 (페이지 ${currentPage}/${totalPages})`;

    renderPagination();
  }

  // ============ (7) 페이지 버튼 렌더링 ============
  function renderPagination() {
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "page-btn";
      btn.textContent = i;
      btn.dataset.page = i;
      if (i === currentPage) btn.classList.add("active");
      paginationEl.appendChild(btn);
    }

    document.querySelectorAll(".page-btn").forEach(b => {
      b.addEventListener("click", e => {
        const page = parseInt(e.target.dataset.page, 10);
        displayPage(page);
      });
    });
  }

  // ============ (8) 검색 로직 ============
  function handleSearch(e) {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      filteredData = glossaryData;
    } else {
      filteredData = glossaryData.filter(item => {
        const en = item.en.toLowerCase();
        const ko = item.ko.toLowerCase();
        const desc = item.desc.toLowerCase();
        return en.includes(val) || ko.includes(val) || desc.includes(val);
      });
    }
    totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
    displayPage(1);
  }

  // ============ (9) 초성/알파벳 버튼 ============
  function handleInitialClick(e) {
    const init = e.target.dataset.initial;
    if (!init) return;
    document.getElementById("searchInput").value = "";

    if (/[ㄱ-ㅎ]/.test(init)) {
      filteredData = glossaryData.filter(item => {
        const koInit = getHangulInitial(item.ko);
        return koInit === init;
      });
    } else {
      filteredData = glossaryData.filter(item => {
        const firstEn = item.en.trim().charAt(0).toLowerCase();
        return firstEn === init.toLowerCase();
      });
    }
    totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
    displayPage(1);
  }

  
  (function init() {
    
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", handleInitialClick);
    });
    
    document.getElementById("searchInput").addEventListener("input", handleSearch);

    
    loadGlossaryData();
  })();