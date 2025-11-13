function downloadResume() {
    const selected = document.getElementById('resumeSelect').value;
    if (!selected) {
        alert('Please select a resume first');
        return;
    }
    const link = document.createElement('a');
    link.href = selected;
    link.download = '';
    link.click();
}