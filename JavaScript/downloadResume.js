function downloadResume() {
    const selected = document.getElementById('resumeSelect').value;
    if (!selected) {
      alert('Please select a resume first');
      return;
    }
    
    // Fetch and download for mobile/tablet compatibility
    fetch(selected)
      .then(response => response.blob())
      .then(blob => {
        const filename = selected.split('/').pop();
        
        // For mobile devices
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          // For desktop
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }
      })
      .catch(error => {
        console.error('Download error:', error);
        alert('Failed to download resume');
      });
  }