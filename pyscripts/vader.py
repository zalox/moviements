import sys
sys.path.append('/usr/local/lib/python2.7/dist-packages')
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment
text = sys.argv[1]
sentences = text.split('\n')

t_neg = 0
t_pos = 0
t_neu = 0
t_compound = 0

for sentence in sentences:
    vs = vaderSentiment(sentence)
    t_neg = t_neg + vs['neg']
    t_pos = t_pos + vs['pos']
    t_neu = t_neu + vs['neu']
    t_compound = t_compound + vs['compound']

num_sentences = float(len(sentences))

avg_neg = t_neg / num_sentences
avg_pos = t_pos / num_sentences
avg_neu = t_neu / num_sentences
avg_compound = t_compound / num_sentences

net = avg_pos - avg_neg
print(net)
sys.stdout.flush()
