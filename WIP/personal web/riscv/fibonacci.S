.data

carrret:
	.asciiz "\n"
seed0:
	.word 0
seed1:
	.word 1
spacestr:
	.asciiz " "

.text
	li s0, 5        #number of fibonacci numbers to print
                    #https://github.com/61c-teach/venus/wiki/Environmental-Calls

	lw a0, seed0	#load the first two numbers
	lw a1, seed1
fiboloop:
	ble s0, zero, programexit
	call fibonacci
	addi s0, s0, -1
	j fiboloop

#prints the next fibonacci number
# a0 and a1 contains the two previous fibonacci numbers
#returns the next two fibonacci numbers in a0 and a1 too
fibonacci:
	add t0, a0, a1
	add a0, a1, zero
	add a1, t0, zero
	#
	addi sp, sp, -8
	# save the numbers in a0, a1
	sw a0, 0(sp)
	sw a1, 4(sp)
	# print the number in a1
	addi a0, zero, 1
	ecall
	# print space
	li a0, 4        #print space string
	la a1, spacestr	#asciiz string addr
	ecall
	# restorethe numbers in a0, a1
	lw a0, 0(sp)
	lw a1, 4(sp)
	addi sp, sp, 8
	ret	

programexit:
	li a0, 4        #print string carriage return 
	la a1, carrret 	#asciiz string addr
	ecall
