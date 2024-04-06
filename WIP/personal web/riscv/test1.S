#here it goes the kernel code
#it setups the stack pointer
	addi	zero,zero,0 
kernel:             
	addi	sp,zero,1536
	call	main        
	addi	zero,zero,0 
	mv      s1,a0   
	addi	zero,zero,0 
	addi	zero,zero,0 
	auipc	ra,0x0      
	jalr	ra,0(ra)    
	addi	zero,zero,0 
	addi	zero,zero,0 

    #here it goes the read only data
    .rodata
.HELLO:
    # .string "Hello World!\n\0" in reverse split in words
    .word 0x6C6C6548
    .word 0x6F57206F
    .word 0x21646C72
    .word 0x0000000D

    #here it goes the code
    .text
main:
    # print the string .HELLO
    addi t0, zero, 3         # this is the string printing syscall 
    lui a0, %hi(.HELLO)      # this loads the top 20 bits 
                             # of .HELLO address into a0
    addi a0, a0, %lo(.HELLO) # this loads the bottom 12 bits
    addi a1, zero, 13         # length of the string
    ecall

    #ask the user for a number 
    addi t0, zero, 4
    ecall

    #now a0 containts the number
    #do a countdown

countdown:
    # print the number
    addi t0, zero, 1
    ecall 

    #iterate until a0 is negative
    addi a0, a0, -1 		
    bge a0, zero, countdown 

    
