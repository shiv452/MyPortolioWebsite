// Below code is to spin 360 deg in rotation ----> working as expected
// const logo = document.getElementById('logo');

//         // Function to start spinning the logo
//         function startSpin() {
//             logo.style.transition = 'transform 0.1s linear';
//             logo.style.transform = 'rotate(360deg)';
//             logo.style.animation = 'spin 0.8s infinite linear';
//         }

//         // Function to stop spinning the logo
//         function stopSpin() {
//             logo.style.transition = 'transform 0.5s ease';
//             logo.style.transform = 'rotate(0deg)';
//             logo.style.animation = '';
//         }

//         // Add mouseover and mouseout events to the logo
//         logo.addEventListener('mouseover', startSpin);
//         logo.addEventListener('mouseout', stopSpin);


// Below code is to spin logo in X and Y direction 
const logo = document.getElementById('logo');

        // Function to start infinite 3D spinning
        function startSpin() {
            logo.style.animation = 'spin3D 7s infinite linear'; // 3D spin effect, infinite
        }

        // Function to stop spinning
        function stopSpin() {
            logo.style.animation = ''; // Remove the animation to stop spinning
        }

        // Add mouseover and mouseout events to the logo
        logo.addEventListener('mouseover', startSpin);
        logo.addEventListener('mouseout', stopSpin);

        // Keyframes for 3D spin animation
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes spin3D {
                10% {
                    transform: rotateX(30deg) rotateY(20deg);
                }
                60% {
                    transform: rotateY(160deg) rotateY(160deg);
                }
                100% {
                    transform: rotateX(360deg) rotateY(360deg);
                }
            }
        `, styleSheet.cssRules.length);