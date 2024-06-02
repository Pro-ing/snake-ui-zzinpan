export const duration = ( frameUpdateCallback, milliseconds ) => {

    const startTime = Date.now();
    let rafId = null;

    const frame = () => {

        const elapsedTime = Date.now() - startTime;
        if( milliseconds <= elapsedTime ){
            frameUpdateCallback( 1 );
            cancelAnimationFrame( rafId );
            return;
        }

        frameUpdateCallback( elapsedTime / milliseconds );
        rafId = requestAnimationFrame( frame );

    };
    frame();

};