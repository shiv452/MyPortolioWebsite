function downloadResume() {
    const selected = document.getElementById('resumeSelect').value;
    if (!selected) {
        alert('Please select a resume first');
    return;
    }

    const filename = selected.split('/').pop();
    
    // Use simple direct download for all devices
    const link = document.createElement('a');
    link.href = selected;
    link.download = filename;
    link.setAttribute('download', filename);
    
    // Ensure link is in DOM for mobile compatibility
    document.body.appendChild(link);
    
    // Trigger click
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}