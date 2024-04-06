   .data
    dataword1:
    .text


    li t0, -1234567
    sw t0, dataword1, a0
    lw t1, dataword1

    li t2, -10
    sb t2, dataword1, a1
    lw t3, dataword1

    li t4, -1234
    sh t4, dataword1, a2
    lh t5, dataword1