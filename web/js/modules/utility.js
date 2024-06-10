export const duration = ( frameUpdateCallback, milliseconds ) => {

    return new Promise(( resolve ) => {

        const startTime = Date.now();
        let rafId = null;

        const frame = () => {

            const elapsedTime = Date.now() - startTime;
            if( milliseconds <= elapsedTime ){
                frameUpdateCallback( 1 );
                cancelAnimationFrame( rafId );
                resolve();
                return;
            }

            frameUpdateCallback( elapsedTime / milliseconds );
            rafId = requestAnimationFrame( frame );

        };
        frame();

    });

};